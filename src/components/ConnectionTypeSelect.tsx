import React, {useState} from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';
import { ConnectionOptionType } from '../../types/ConnectionOptionType';
import CurrentConnectionOption from './CurrentConnectionOption';
import dynamic from 'next/dynamic';
const Normal = dynamic(() => import('./connection_select_options/Normal'), {ssr: false})
const Many = dynamic(() => import('./connection_select_options/Many'), { ssr: false });
const One = dynamic(() => import('./connection_select_options/One'), {ssr: false})
const OneOrMany = dynamic(() => import('./connection_select_options/OneOrMany'), {ssr: false})
const OnlyOne = dynamic(() => import('./connection_select_options/OnlyOne'), {ssr: false})
const ZeroOrMany = dynamic(() => import('./connection_select_options/ZeroOrMany'), {ssr: false})
const ZeroOrOne = dynamic(() => import('./connection_select_options/ZeroOrOne'), {ssr: false})
import { useAppSelector, useAppDispatch } from '../helpers/hooks'
import { updateConnection, updateDefaultConnectionOption } from '../../store/reducers/canvasReducer';
import backendAxios from '../helpers/getAxios';
import { useSession } from 'next-auth/react';
import getAxios from '../helpers/getAxios';
import { CustomSessionType } from '../../types';
import { CAN_EDIT, OWNER } from '../../types/PermissionType';


export const optionStageWidth = 40
export const optionStageHeight = 30
export const optionCanvasMargin = 3
interface Props {
    direction: "source" | "destination"
}
function ConnectionTypeSelect(props:Props) {
    const {direction} = props
    const [open, setOpen] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(false)
    const defaultConnectionOption = useAppSelector(state => state.canvases.defaultConnectionOption)
    const currentConnection = useAppSelector(state => state.canvases.currentConnection)
    const connections = useAppSelector(state => state.canvases.connections)
    const currentPermission = useAppSelector(state => state.canvases.currentPermission)
    const canEdit = [OWNER, CAN_EDIT].includes(currentPermission)
    const dispatch = useAppDispatch()
    const { data: session } = useSession()
    const axios = getAxios(session as CustomSessionType | null)
    const handleTooltipClose = () => {
        setOpen(false);
      };
    
      const handleTooltipOpen = () => {
        setOpen(true);
      };

    const onClick = async (connectionOption:ConnectionOptionType) => {
      if (currentConnection !== null) {
          const newConnection = {
            ...currentConnection,
            [direction]: {...currentConnection[direction], connectionOption: connectionOption}
          }

          try {
            const res = await axios.put(`api/v1/connection/${newConnection.id}`, newConnection)
            console.log(res)
          } catch (err) {
            console.log(err)
          }
          //dispatch(updateConnection(newConnection))
        
      } else {
        const newDefaultConnectionOption = {
          ...defaultConnectionOption,
          [direction]: connectionOption
        }
        dispatch(updateDefaultConnectionOption(newDefaultConnectionOption))
      }
      setOpen(false)
    }
  return (
    <Grid item>
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <div>
              <Tooltip
                PopperProps={{
                  disablePortal: true
                }}
                onClose={handleTooltipClose}
                open={open && canEdit}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={
                    <React.Fragment>
                      <Button onClick={() => onClick("normal")}>
                        <Normal/>
                        </Button>
                        <Button onClick={() => onClick("one")}>
                        <One direction={direction}/>
                        </Button>
                        <Button onClick={() => onClick("many")}>
                        <Many direction={direction}/>
                        </Button>
                        <Button onClick={() => onClick("one-or-many")}>
                        <OneOrMany direction={direction}/>
                        </Button>
                        <Button onClick={() => onClick("only-one")}>
                        <OnlyOne direction={direction}/>
                        </Button>
                        <Button onClick={() => onClick("zero-or-many")}>
                        <ZeroOrMany direction={direction}/>
                        </Button>
                        <Button onClick={() => onClick("zero-or-one")}>
                        <ZeroOrOne direction={direction}/>
                        </Button>
                    </React.Fragment>
                  }
              >
                <Button onClick={handleTooltipOpen} disabled={disabled}>
                    <CurrentConnectionOption direction={direction}/>
                    <KeyboardArrowDownIcon/></Button>
              </Tooltip>
            </div>
          </ClickAwayListener>
        </Grid>
  )
}

export default ConnectionTypeSelect