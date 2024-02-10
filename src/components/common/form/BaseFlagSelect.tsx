"use client"
import React, { useState } from "react";
import ReactFlagsSelect from "react-flags-select";

const BaseFlagSelect = () => {
    const [selected, setSelected] = useState("");
    return(
        <ReactFlagsSelect
            selected={selected}
            onSelect={(code) => setSelected(code)}
        />
    )
};

export default BaseFlagSelect;