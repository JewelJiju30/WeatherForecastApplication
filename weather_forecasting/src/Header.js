import { Menubar } from "primereact/menubar";
import React from "react";
import { InputText } from 'primereact/inputtext';
const Header = (props) => {

    const items = [
        {
            label: 'File',
            icon: 'pi pi-fw pi-file',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-plus'
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-fw pi-trash'
                },
                {
                    separator: true
                },
                {
                    label: 'Export',
                    icon: 'pi pi-fw pi-external-link'
                }
            ]
        },
        {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            items: [
                {
                    label: 'Left',
                    icon: 'pi pi-fw pi-align-left'
                },
                {
                    label: 'Right',
                    icon: 'pi pi-fw pi-align-right'
                },
                {
                    label: 'Center',
                    icon: 'pi pi-fw pi-align-center'
                },
                {
                    label: 'Justify',
                    icon: 'pi pi-fw pi-align-justify'
                },

            ]
        },
        {
            label: 'Users',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-user-plus',

                },
                {
                    label: 'Delete',
                    icon: 'pi pi-fw pi-user-minus',

                },
                {
                    label: 'Search',
                    icon: 'pi pi-fw pi-users',
                    items: [
                        {
                            label: 'Filter',
                            icon: 'pi pi-fw pi-filter',
                            items: [
                                {
                                    label: 'Print',
                                    icon: 'pi pi-fw pi-print'
                                }
                            ]
                        },
                        {
                            icon: 'pi pi-fw pi-bars',
                            label: 'List'
                        }
                    ]
                }
            ]
        },
        {
            label: 'Login',
            icon: 'pi pi-fw pi-power-off'
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