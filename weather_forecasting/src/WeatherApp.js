import Header from "./Header"
import Weather from "./Weather"
import React from "react"
import Sidebar from "./Sidebar"

const WeatherApp = () => {
    return (
        <><Header />
            <div className="two-column-container">
                <div className="right-column">
                    <Weather />
                </div>
            </div>

        </>
    )
}
export default WeatherApp