import React from 'react'
import dynamic from 'next/dynamic';
const Normal = dynamic(() => import('./connection_select_options/Normal'), {ssr: false})
const Many = dynamic(() => import('./connection_select_options/Many'), { ssr: false });
const One = dynamic(() => import('./connection_select_options/One'), {ssr: false})
const OneOrMany = dynamic(() => import('./connection_select_options/OneOrMany'), {ssr: false})
const OnlyOne = dynamic(() => import('./connection_select_options/OnlyOne'), {ssr: false})
const ZeroOrMany = dynamic(() => import('./connection_select_options/ZeroOrMany'), {ssr: false})
const ZeroOrOne = dynamic(() => import('./connection_select_options/ZeroOrOne'), {ssr: false})
import { useAppSelector, useAppDispatch } from '../helpers/hooks'
import { ConnectionOptionType } from '../GlobalType';


interface Props {
  direction: "source" | "destination"
}
function CurrentConnectionOption(props:Props) {
  const {direction} = props
  const defaultConnectionOption = useAppSelector(state => state.canvases.defaultConnectionOption)
  const currentConnectionId = useAppSelector(state => state.canvases.currentConnectionId)
  const connections = useAppSelector(state => state.canvases.connections)
  const currentConnection = connections.find((connection) => connection.id === currentConnectionId) !== undefined?
  connections.find((connection) => connection.id === currentConnectionId):
  {source: {connectionOption: "normal"}, destination: {connectionOption: "normal"}}


  const getCurrentConnectionOption = (option:ConnectionOptionType) => {
    switch(option) {
      case "normal":
        return <Normal/>
      case "one":
        return <One direction={direction}/>
      case "many":
        return <Many direction={direction}/>
      case "one-or-many":
        return <OneOrMany direction={direction}/>
      case "only-one":
        return <OnlyOne direction={direction}/>
      case "zero-or-many":
        return <ZeroOrMany direction={direction}/>
      case "zero-or-one":
        return <ZeroOrOne direction={direction}/>
      default:
        return <></>
    }
  }
  return (
    <>
    {currentConnectionId === null?
    getCurrentConnectionOption(defaultConnectionOption[direction]):
    getCurrentConnectionOption(currentConnection[direction].connectionOption)}
    </>
  )
}

export default CurrentConnectionOption