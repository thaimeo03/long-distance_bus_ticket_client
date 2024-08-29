'use client'
import { Progress } from '@/components/ui/progress'
import { FireExtinguisher, Milk, Plug, WifiHigh } from 'lucide-react'
import BusServiceTabs from './bus-services-tab'
import useBusStore from '@/stores/schedule.store'
import BookingSheet from './booking-sheet'
import { useQuery } from '@tanstack/react-query'
import { getAllAvailableSchedules } from '@/apis/schedules.api'
import { IAvailableScheduleResponse } from '@/common/interfaces/schedules.interface'
import { IRouteStop } from '@/common/interfaces/route-stops.interface'
import { formatMoney, formatTime } from '@/lib/utils'
import { useEffect } from 'react'

export interface IScheduleItem {
  companyImage: string
  companyName: string
  busName: string
  busNumber: string
  departureInfo: IDepartureInfo[]
  arrivalInfo: IArrivalInfo
  travelTime: string
  price: string
  seatsAvailable: number
  totalSeat: number
  busImages: string[]
}

interface IDepartureInfo {
  departureTime: string
  departurePoint: string
}

interface IArrivalInfo {
  arrivalTime: string
  arrivalPoint: string
}

export default function ScheduleList() {
  const { setScheduleList } = useBusStore()
  const { data } = useQuery({
    queryKey: ['schedules'],
    queryFn: () => getAllAvailableSchedules()
  })

  useEffect(() => {
    if (data) {
      setScheduleList(data.data)
    }
  }, [data])

  // console.log(busList)

  if (!data) return null

  return (
    <div className='mt-10 flex flex-col gap-5'>
      {data.data.map((item, index) => (
        <ScheduleItem item={item} key={index} />
      ))}
    </div>
  )
}

export function ScheduleItem({ item }: { item: IAvailableScheduleResponse }) {
  const { bus, route } = item
  const emptySeat = bus.seats.filter((seat) => seat.isAvailable === true).length
  const totalSeat = bus.seats.length

  return (
    <div className='relative h-44 grid grid-cols-12 gap-x-2 p-2 border border-gray-300 rounded'>
      <div className='col-span-1'>
        <img src={bus.busCompany?.mainImage} alt='bus company' className='w-16 max-w-full object-cover' />
      </div>
      <div className='col-span-2'>
        <p className='font-semibold'>{bus.busCompany?.name}</p>
        <span className='block mt-3 text-sm text-foreground'>{bus.name}</span>
        <div className='mt-1 flex items-center space-x-1 text-sm'>
          <span className='font-semibold'>Biển xe:</span>
          <span className='text-sm text-foreground'>{bus.busNumber}</span>
        </div>
        <div className='mt-5 flex space-x-1 items-center'>
          <WifiHigh className='w-5 h-5 cursor-pointer text-gray-600' />
          <Milk className='w-5 h-5 cursor-pointer text-gray-600' />
          <Plug className='w-5 h-5 cursor-pointer text-gray-600' />
          <FireExtinguisher className='w-5 h-5 cursor-pointer text-gray-600' />
        </div>
      </div>
      <div className='col-span-2'>
        <span className='text-lg font-bold'>{formatTime(route.routeStops[0].arrivalTime)}</span>
        <span className='block mt-3 text-sm text-foreground'>{route.routeStops[0].location}</span>
      </div>
      <div className='col-span-2'>
        <span className='text-lg font-semibold'>
          {formatTime(route.routeStops[route.routeStops.length - 1].arrivalTime)}
        </span>
        <span className='block mt-3 text-sm text-foreground max-w-[90%]'>
          {route.routeStops[route.routeStops.length - 1].location}
        </span>
      </div>
      <div className='col-span-1'>
        <span className='text-foreground font-medium'>{item.route.durationHours}g 00ph</span>
      </div>
      <div className='col-span-2'>
        <span className='text-lg font-bold text-primary'>{formatMoney(route.prices[0].price)} </span>
      </div>
      <div className='col-span-2'>
        <div className='mt-4'>
          <Progress value={(emptySeat / totalSeat) * 100} className='h-2 w-28' />
          <div className='flex mt-3 items-center space-x-1'>
            <span className='font-semibold'>
              {emptySeat}/{totalSeat}
            </span>
            <span className='text-sm text-foreground'> ghế có sẵn</span>
          </div>
        </div>
      </div>

      <div className='absolute bottom-0 right-0 -translate-x-1 -translate-y-1'>
        <div className='flex items-center justify-end'>
          <BusServiceTabs bus={bus} routeStops={route.routeStops} />

          <BookingSheet />
        </div>
      </div>
    </div>
  )
}
