'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import RouteDetails from './route-details'
import { useQuery } from '@tanstack/react-query'
import { getAllRouteDetails } from '@/apis/route.api'

export default function RouteTable() {
  const { data } = useQuery({
    queryKey: ['all-route-details'],
    queryFn: getAllRouteDetails
  })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Start Location</TableHead>
          <TableHead>End Location</TableHead>
          <TableHead>Distance (km)</TableHead>
          <TableHead>Duration (hours)</TableHead>
          <TableHead>View Route</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(data?.data || []).map((route) => (
          <TableRow key={route.id}>
            <TableCell>{route.startLocation}</TableCell>
            <TableCell>{route.endLocation}</TableCell>
            <TableCell>{route.distanceKm}</TableCell>
            <TableCell>{route.durationHours}</TableCell>
            <TableCell>
              <RouteDetails stops={route.routeStops} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
