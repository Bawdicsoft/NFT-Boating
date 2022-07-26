import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SelectDate() {
    const [date, setDate] = useState(new Date());
    const [days, setDays] = useState(new Date().setDate(new Date().getDate() + 20));
    var availDate = new Date(days);
    var daysAdded = availDate;
    // console.log("dddddd",availDate.toString());

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