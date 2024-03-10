import { prisma } from "@/db/config";
import ServerError, { JWTPayload } from "@/lib/types";
import { decryptToken, errorHandler, getOpenAIApiInstance } from "@/lib/utils";
import { deepEqual } from "assert";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import csv from "csv-parser";

const patientSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  gender: z.string(),
  dateOfBirth: z.string(),
  phone: z.string(),
  address: z.string(),
  medicalHistory: z.string(),
  addedByUserId: z.string(),
});

type Patient = z.infer<typeof patientSchema>;
export async function POST(req: NextRequest) {
  try {
    // const patients = await req.json();
    const authorizationHeader = req.headers.get("Cookie");
    console.log(authorizationHeader);
    const refreshTokenStartIndex =
      authorizationHeader?.match(/refreshToken=([^;]*)/)?.[1];
    if (!refreshTokenStartIndex) {
      throw new ServerError("Unauthorized", 401);
    }
    const accessToken = refreshTokenStartIndex;
    const dbToken = await prisma.token.findFirst({
      where: {
        token: accessToken,
      },
    });
    if (!dbToken) throw new ServerError("Invalid token provided", 409);
    const { id } = decryptToken(accessToken, process.env.JWT_REFRESH_SECRET!);

    const patients: any[] = [];
    const csvText = await req.text();

    const results: any[] = [];
    const parser = csv();
    parser.write(csvText);
    parser.end();

    parser.on("readable", () => {
      let record;
      while ((record = parser.read())) {
        results.push(record);
      }
    });

    parser.on("error", (err) => {
      throw new ServerError(`CSV parsing error: ${err.message}`, 400);
    });
    parser.on("end", async () => {
      // Process the parsed CSV data (results array)
      let transformedData: Patient[] = [];

      let validPatients = results.map((patient) => {
        try {
          return patient;
        } catch (error) {
          console.log(error);
          // throw new ServerError(`Invalid patient data: ${error.errors}`, 400);
        }
      });

      const filteredPatientsData = validPatients.filter(
        (obj) =>
          Object.keys(obj)[1] === "_1" &&
          obj[Object.keys(obj)[1]] !== "column 2"
      );

      filteredPatientsData.forEach((item) => {
        const key = Object.values(item)[0];
        const value = item._1;

        switch (key) {
          case "name":
            transformedData.push({
              name: value,
              email: "",
              gender: "",
              dateOfBirth: "",
              phone: "",
              address: "",
              medicalHistory: "",
              addedByUserId: id,
            });
            break;
          case "email":
            transformedData[transformedData.length - 1].email = value;
            break;
          case "gender":
            transformedData[transformedData.length - 1].gender =
              value.toLowerCase();
            break;
          case "dateOfbirth":
            transformedData[transformedData.length - 1].dateOfBirth = value;
            break;
          case "Phone":
            transformedData[transformedData.length - 1].phone = `+${value}`;
            break;
          case "Address":
            transformedData[transformedData.length - 1].address = value;
            break;
          case "medicalHistory":
            transformedData[transformedData.length - 1].medicalHistory = value;
            break;
          default:
            break;
        }
      });

      console.log(transformedData);
      const createdPatient = await prisma.patient.createMany({
        data: transformedData,
      });
      return NextResponse.json(createdPatient);
    });
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}
