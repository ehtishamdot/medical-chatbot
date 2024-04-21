"use client"
import {
    Calendar as BigCalendar,
    momentLocalizer,
} from "react-big-calendar";
import moment from 'moment'
import Breadcrumb from "@/components/common/breadcrumbs/Breadcrumb";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CreateAppointments from "@/components/modules/appointments/create-appointments";
import AppointmentService from "@/services/appointment/appointment.service";
import LoadingPage from "@/components/common/loaders/loading-page";
import {useMemo} from "react";

const Calendar = () => {
    const localizer = momentLocalizer(moment)
    const {useFetchAllAppointments}=AppointmentService()
    const {data:appointmentData,isLoading:isAppointmentDataLoading}=useFetchAllAppointments();
    const appointment=useMemo(()=>{
        return appointmentData?.flatMap((el)=>{
            return {
                ...el,
                startDate: moment(el.startDate).toDate(),
                endDate: moment(el.startDate).toDate(),
                title:el.patientName+"  ("+el.patientEmail+")  "

            }
        })
    },[appointmentData])
    console.log(appointment)
    if(isAppointmentDataLoading){
        return  <LoadingPage/>
    }
    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Appointments"/>
            <CreateAppointments/>
            <div className={"bg-white p-6"}>
                {appointment&&<BigCalendar
                    localizer={localizer}
                    events={appointment}
                    startAccessor={"startDate"}
                    titleAccessor={"title"}
                    endAccessor={"endDate"}
                    style={{height: 500}}
                />}
            </div>
        </div>
    );
};

export default Calendar;
