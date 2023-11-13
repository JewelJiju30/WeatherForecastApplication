import { useEffect } from "react";
import React from "react";

const Sidebar = () => {
    // const dispatch = useDispatch();

    useEffect(() => {
        // Dispatch the async action when the component mounts
        // dispatch(getWeather("WEATHERDATA"));
        // dispatch({type:"GET_WEATHER", payload:"newvalue"})
    }, []);

    //   const weatherData = useSelector(
    //     (state) => state.weatherUpdates
    //   )

    //   console.log(weatherData)


    return (<>
        <aside className="left-column">
            <div style={{ paddingTop: '20px' }}>
                <section>
                    <div style={{ marginLeft: '40px', marginRight: '40px', paddingBottom: "20px" }}>
                        <div><h1 className="" style={{ paddingBottom: '20px' }}>Climate Updates</h1></div>
                        <div className="">
                            <a className="" style={{ marginTop: '4px', marginBottom: '4px' }}>Back to search results</a>
                        </div>
                    </div>
                    <div style={{ marginLeft: '40px', marginRight: '40px' }}>
                        <div>
                            <div><span className="" style={{ fontSize: '16px' }}>Text1</span></div>
                            <div style={{ paddingBottom: '20px' }}><span className="" style={{ fontSize: '16px' }}>Text2</span></div>
                            <div>
                                <div style={{ display: 'flex', flexDirection: 'row', fontSize: '16px', paddingBottom: "10px" }}>
                                    <span className="">Text3</span>
                                    <div style={{ marginLeft: '4px', marginRight: '4px' }}>→</div>
                                    <span className="">Text4</span>
                                </div>
                                <a className="" style={{ color: "#053ab9" }}>View itinerary details</a>
                                <div className="d-flex justify-content-sm-between pb-2 pt-2 ">
                                    <div className="pt-2">
                                        Due today
                                    </div>
                                    <div className="pt-2 pr-2">
                                        Text5
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div style={{ marginLeft: '40px', marginRight: '40px', marginTop: '20px', borderTop: '1px solid rgb(189, 190, 192)', paddingTop: '20px', paddingBottom: '20px' }}>
                        <a style={{ color: 'blue' }}>View Cancellation Policy</a>
                    </div>

                </section>
            </div>
        </aside>
    </>
    )
}
export default Sidebar