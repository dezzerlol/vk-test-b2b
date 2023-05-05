import { Button, NativeSelect, Textarea, Title } from '@mantine/core'
import { DateInput, DatesProvider, TimeInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { FormEvent, useState } from 'react'
import styles from './App.module.css'

const TOWERS = ['A', 'B']
const FLOORS = Array.from({ length: 27 }, (_, k) => `${k + 1}`).slice(2)
const ROOMS = Array.from({ length: 10 }, (_, k) => `${k + 1}`)

const initialValues = {
  tower: '',
  floor: '',
  room: '',
  date: null,
  timeStart: '',
  timeEnd: '',
  comm: '',
}

const App = () => {
  const [form, setForm] = useState(initialValues)
  const [timeError, setTimeError] = useState('')

  const resetForm = () => {
    setForm(initialValues)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const { hours: hoursStart, minutes: minutesStart } = getHoursMinutes(form.timeStart)
    const { hours: hoursEnd, minutes: minutesEnd } = getHoursMinutes(form.timeEnd)

    const dateStart = dayjs(form.date).set('h', hoursStart).set('m', minutesStart)
    const dateEnd = dayjs(form.date).set('h', hoursEnd).set('m', minutesEnd)

    if (dateEnd.isBefore(dateStart)) {
      setTimeError('Время окончания не может быть раньше времени начала')
      return
    }

    // Даты начала и окончания сохраняются в виде ISO string
    const data = JSON.stringify({
      tower: form.tower,
      floor: form.floor,
      room: form.room,
      dateStart: dateStart.toISOString(),
      dateEnd: dateEnd.toISOString(),
      comm: form.comm,
    })

    console.log(data)
    notifications.show({
      title: 'Успех',
      message: 'Успешно создано бронирование',
    })

    setTimeError('')
  }

  const handleInputChange = (name: string, value: any) => {
    setForm({
      ...form,
      [name]: value,
    })
  }

  const getHoursMinutes = (date: string) => {
    const arr = date.split(':')
    return { hours: +arr[0], minutes: +arr[1] }
  }

  return (
    <div className={styles.page_container}>
      <div className={styles.booking_container}>
        <Title order={6}>Форма бронирования переговорной</Title>
        <form className={styles.booking_form} onSubmit={handleSubmit}>
          <NativeSelect
            data={TOWERS}
            placeholder='Выберите башню...'
            label='Башня'
            name='tower'
            required
            value={form.tower}
            onChange={(e) => handleInputChange('tower', e.currentTarget.value)}
          />
          <NativeSelect
            data={FLOORS}
            placeholder='Выберите этаж...'
            label='Этаж'
            name='floor'
            required
            value={form.floor}
            onChange={(e) => handleInputChange('floor', e.currentTarget.value)}
          />
          <NativeSelect
            data={ROOMS}
            placeholder='Выберите переговорную...'
            label='Переговорная'
            name='room'
            required
            value={form.room}
            onChange={(e) => handleInputChange('room', e.currentTarget.value)}
          />
          <DatesProvider settings={{ locale: 'ru' }}>
            <DateInput
              label='Дата'
              placeholder='Выберите дату...'
              valueFormat='D MMM YYYY'
              name='date'
              required
              minDate={new Date()}
              value={form.date}
              onChange={(v) => handleInputChange('date', v)}
            />
            <TimeInput
              label='Время начала'
              name='timeStart'
              required
              value={form.timeStart}
              onChange={(e) => handleInputChange('timeStart', e.currentTarget.value)}
            />
            <TimeInput
              label='Время окончания'
              name='timeEnd'
              required
              value={form.timeEnd}
              error={timeError}
              onChange={(e) => handleInputChange('timeEnd', e.currentTarget.value)}
            />
          </DatesProvider>
          <Textarea
            label='Комментарий'
            placeholder='Введите комментарий...'
            name='comm'
            value={form.comm}
            onChange={(e) => handleInputChange('comm', e.currentTarget.value)}
          />
          <div className={styles.form_buttons}>
            <Button variant='subtle' onClick={resetForm}>
              Очистить
            </Button>
            <Button type='submit'>Отправить</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App
