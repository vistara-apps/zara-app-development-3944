import React from 'react'

const SkeletonCard = ({ className = '', children }) => (
  <div className={`card animate-pulse ${className}`}>
    {children}
  </div>
)

const SkeletonLine = ({ width = 'full', height = '4', className = '' }) => (
  <div 
    className={`bg-gray-200 rounded ${className}`}
    style={{
      width: width === 'full' ? '100%' : width,
      height: `${height === '4' ? '1rem' : height}`
    }}
  />
)

const SkeletonCircle = ({ size = '12', className = '' }) => (
  <div 
    className={`bg-gray-200 rounded-full ${className}`}
    style={{
      width: `${size === '12' ? '3rem' : size}`,
      height: `${size === '12' ? '3rem' : size}`
    }}
  />
)

// Pre-built skeleton components for common patterns
export const TransactionSkeleton = () => (
  <SkeletonCard>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <SkeletonCircle size="10" />
        <div className="space-y-2">
          <SkeletonLine width="120px" height="4" />
          <SkeletonLine width="80px" height="3" />
        </div>
      </div>
      <div className="text-right space-y-2">
        <SkeletonLine width="80px" height="4" />
        <SkeletonLine width="60px" height="3" />
      </div>
    </div>
  </SkeletonCard>
)

export const StatCardSkeleton = () => (
  <SkeletonCard>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <SkeletonLine width="100px" height="4" />
        <SkeletonCircle size="8" />
      </div>
      <SkeletonLine width="120px" height="8" />
      <SkeletonLine width="80px" height="3" />
    </div>
  </SkeletonCard>
)

export const ChartSkeleton = () => (
  <SkeletonCard className="h-80">
    <div className="space-y-4">
      <SkeletonLine width="150px" height="6" />
      <div className="h-64 bg-gray-200 rounded" />
    </div>
  </SkeletonCard>
)

export const BudgetSkeleton = () => (
  <SkeletonCard>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonLine width="100px" height="5" />
        <SkeletonLine width="60px" height="4" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <SkeletonLine width="80px" height="3" />
          <SkeletonLine width="60px" height="3" />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2" />
      </div>
    </div>
  </SkeletonCard>
)

export { SkeletonCard, SkeletonLine, SkeletonCircle }

