import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";

export default function App() {
    const [date, setDate] = useState(new Date());
    const [days, setDays] = useState(new Date().setDate(new Date().getDate() + 20));
    var availDate = new Date(days);
    console.log("dddddd",availDate.toString());
    var daysAdded = availDate
    //   console.log("Date",date);
    // console.log("days", days);

    // alert(datee.toString());

    //   function addDays() {

    //     return ;
    //   }

    // useEffect(() => {
    //     var result = new Date();
    //     // var days = "1"
    //     result.setDate(result.getDate() + 20);
    //     // return () => {
    //     //     result
    //     setDays({ result });

    //     // };
    //     // console.log("dateeeeee",result);
    // }, []);


    //   const [maxDateee, setMaxDateee] = useState("25/06/20220");

    //   console.log(maxDateee);
    return (
        <DatePicker
            name="invoiceDate"
            className="form-control form-control-sm"
            type="text"
            size="sm"
            placeholder=""
            selected={date}
            minDate={new Date()}
            maxDate={daysAdded}
            value={date}
            onChange={(d) => {
                setDate(d);
            }}
            dateFormat="dd/MM/yyyy"
            onKeyDown={(e) => {
                e.preventDefault();
            }}
        />
    );
}