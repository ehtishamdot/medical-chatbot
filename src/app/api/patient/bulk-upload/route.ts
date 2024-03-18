import { prisma } from "@/db/config";
import ServerError from "@/lib/types";
import { decryptToken, errorHandler, getOpenAIApiInstance } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import csv from "csv-parser";
import { Readable } from "stream";

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

    const multipartFormData = await req.formData();
    const csvFile = multipartFormData.get("patients");
    if (!(csvFile instanceof File))
      throw new ServerError("CSV file not found in form data", 400);
    const csvText = await csvFile.text();

    const patients: Patient[] = [];

    console.log(multipartFormData);
    const readableStream = Readable.from([csvText]);
    const parser = readableStream.pipe(csv());

    let createdPatients: {
      id: string;
      name: string;
      email: string;
      gender: string;
      dateOfBirth: Date;
      phone: string;
      address: string;
      medicalHistory: string;
      addedByUserId: string;
    }[] = [];
    parser
      .on("error", (err) => {
        throw new ServerError(`CSV parsing error: ${err.message}`, 400);
      })
      .on("data", (row) => {
        console.log(row);
        patients.push({
          name: row.name,
          email: row.email,
          gender: row.gender,
          dateOfBirth: row.dateOfBirth,
          phone: row.phone,
          address: row.address,
          medicalHistory: row.medicalHistory,
          addedByUserId: id,
        });
      });
    createdPatients = await new Promise((resolve) => {
      parser.on("end", async () => {
        const createdPatients = [];
        for (const patient of patients) {
          try {
            const createdPatient = await prisma.patient.create({
              data: patient,
            });
            createdPatients.push(createdPatient);
          } catch (error) {
            console.error("Error creating patient:", error);
          }
        }
        resolve(createdPatients);
      });
    });
    return NextResponse.json({
      message: "Patients created successfully",
      patients: createdPatients,
    });
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}
