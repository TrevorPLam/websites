import { HTMLAttributes } from 'react'
import { cn } from '@repo/utils'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

/**
 * Skeleton loading component
 * Provides visual feedback while content is loading
 */
const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  )
}

export default Skeleton
