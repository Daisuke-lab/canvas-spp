import React from 'react'
import { ConnectionOptionType, AnchorLocationType } from "../../types"
import One from './connection_options/One'
import Many from './connection_options/Many'
import OnlyOne from './connection_options/OnlyOne'
import Zero from './connection_options/Zero'
interface Props {
    anchorLocation: AnchorLocationType,
    connectionOption: ConnectionOptionType,
    x: number,
    y: number
}
function ConnectionOption(props:Props) {
    const {anchorLocation, connectionOption,x ,y} = props
    const getCurrentConnectionOption = () => {
        switch(connectionOption) {
          case "normal":
            return <></>
          case "one":
            return <One anchorLocation={anchorLocation} x={x} y={y}/>
          case "many":
            return <Many anchorLocation={anchorLocation} x={x} y={y}/>
          case "one-or-many":
            return <>
            <One anchorLocation={anchorLocation} x={x} y={y}/>
            <Many anchorLocation={anchorLocation} x={x} y={y}/>
            </>
          case "only-one":
            return <OnlyOne anchorLocation={anchorLocation} x={x} y={y}/>
          case "zero-or-many":
            return <>
            <Zero anchorLocation={anchorLocation} x={x} y={y}/> 
            <Many anchorLocation={anchorLocation} x={x} y={y}/>
            </>
          case "zero-or-one":
            return <>
            <One anchorLocation={anchorLocation} x={x} y={y}/>
            <Zero anchorLocation={anchorLocation} x={x} y={y}/> 
            </>
          default:
            return <></>
        }
      }
  return (
    <>
    {getCurrentConnectionOption()}
    </>
  )
}

export default ConnectionOption