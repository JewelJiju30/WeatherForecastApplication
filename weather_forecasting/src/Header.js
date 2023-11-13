import { Menubar } from "primereact/menubar";
import React from "react";
import { InputText } from 'primereact/inputtext';
import { useNavigate } from "react-router-dom";

const Header = (props) => {
    const navigate = useNavigate();
    const items = [
        {
            label: "Forecast Weather",
            icon: 'pi pi-fw pi-cloud',
            command: () => {
                navigate("/");
            }
        },
        {
            label: "Current Weather",
            icon: 'pi pi-fw pi-map-marker',
            command: () => {
                navigate("/current_weather");
            }
        }
    ];


    return (
        <>
            <header className="App-header position-fixed">
                <div className="container">
                    <div className="header-style">
                        <div className="header-position">
                            <div className="logo-position">
                                <div className="logo">
                                    <img src="/logo.png" className="image-logo" alt="Site Logo" />
                                </div>
                                <div className="logo-text">
                                    WeatherAPI
                                </div>
                            </div>
                            <div className="card">
                                <Menubar model={items} />
                            </div>
                            <div className="search_bar">
                                <span className="p-input-icon-left">
                                    <i className="pi pi-search" />
                                    <InputText placeholder="Search City" />
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </header>
        </>
    )
}
export default Header