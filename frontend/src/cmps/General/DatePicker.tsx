import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Dayjs } from 'dayjs'
import { colorService } from '../../services/color.service'

const theme = createTheme({
  palette: {
    primary: {
      main: '#ca2c5e'
    }
  },
})

interface DatePickerProps {
  value: Dayjs | null
  onChange: (newValue: Dayjs | null) => void
  name?: string
  id?: string
}

export function DatePicker({ value, onChange, name, id }: DatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <MuiDatePicker
          value={value}
          onChange={onChange}
          slotProps={{
            textField: {
              name: name,
              id: id,
              sx: {
                width: '200px',
                '& .MuiPickersInputBase-root': {
                  height: '50px',
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  paddingRight: '10%',
                  color: colorService.colorMain1,
                  fontFamily: '"Saira Condensed", sans-serif',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  '& svg': {
                    color: colorService.colorMain1,
                  }
                },
                '& .MuiPickersInputBase-root.Mui-focused': {
                  backgroundColor: 'white',
                },
                '& fieldset': {
                  borderColor: colorService.colorMain1,
                  borderWidth: '2px',
                },
                '& .MuiPickersOutlinedInput-notchedOutline': {
                  borderColor: colorService.colorMain1,
                  borderWidth: '2px',
                },
                '&:hover .MuiPickersOutlinedInput-notchedOutline': {
                  borderColor: colorService.colorMain1,
                },
              }
            },
            popper: {
              placement: 'bottom-start',
              sx: {
                '& .MuiPickersCalendarHeader-root': {
                  backgroundColor: colorService.colorMain1,
                  color: 'white'
                },
                '& .MuiPickersArrowSwitcher-button': {
                  color: 'white !important'
                },
                '& .MuiPickersDay-root.Mui-selected': {
                  backgroundColor: colorService.colorMain1,
                  '&:hover': {
                    backgroundColor: colorService.colorMain1Dark1,
                  }
                },
                '& .MuiIconButton-root': {
                  color: colorService.colorMain1,
                },
              }
            }
          }}
        />
      </ThemeProvider>
    </LocalizationProvider>
  )
}

