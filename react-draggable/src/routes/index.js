import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import SliderDemo from '../pages/swipe'

class RouteMap extends React.Component {
    render(){
        return(
            <Router>
                <div>
                <Switch>
                    <Route path="/drag" component={Carousel} />
                </Switch>
                </div>
            </Router>
        )
    }
}

export default RouteMap;