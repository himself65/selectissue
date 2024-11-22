"use client"
import { useState } from 'react'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const items = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' }
]

export function Inner () {
  const [select, setSelect] = useState<string | undefined>(undefined)
  const queryClient = useQueryClient()
  const { data } = useSuspenseQuery({
    queryKey: ['items'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return [...items]
    }
  })
  console.log('current select', select)
  return (
    <form>
      <Select
        value={select}
        onValueChange={(value) => {
          console.log('value change', value)
          if (value === '') {
            console.log('Invalid empty value')
          }
          setSelect(value)
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme"/>
        </SelectTrigger>
        <SelectContent>
          {data.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
          <button
            type='button'
            onClick={async () => {
              console.log('add')
              items.push({
                value: crypto.getRandomValues(new Uint32Array(1))[0].toString(),
                label: `Item ${items.length}`
              })
              await queryClient.invalidateQueries({
                queryKey: ['items']
              })
              setSelect(items[items.length - 1].value)
            }}
          >
            Click
          </button>
        </SelectContent>
      </Select>
    </form>
  )
}