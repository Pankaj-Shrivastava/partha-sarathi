import React from 'react';

export default function SkeletonShlokaCard() {
  return (
    <div className="flex justify-start w-full animate-pulse mt-4">
      <div className="w-full max-w-[95%] shadow-md rounded-[20px] p-[1px] bg-outline-variant/20">
        <div className="bg-white/50 backdrop-blur-[16px] rounded-[19px] p-5 md:p-6 flex flex-col gap-5">
          
          {/* Header Skeleton */}
          <div className="flex items-center gap-2 border-b border-outline-variant/50 pb-3">
            <div className="w-4 h-4 bg-outline-variant/30 rounded-full"></div>
            <div className="h-3 w-32 bg-outline-variant/30 rounded"></div>
          </div>

          {/* Verse Text Skeleton */}
          <div className="flex flex-col items-center gap-2 py-3">
            <div className="h-4 w-3/4 bg-outline-variant/30 rounded"></div>
            <div className="h-4 w-1/2 bg-outline-variant/30 rounded"></div>
          </div>

          {/* English Translation Skeleton */}
          <div className="bg-primary/5 rounded-lg p-5 border border-primary/5 flex flex-col gap-2 items-center">
            <div className="h-4 w-full bg-outline-variant/30 rounded"></div>
            <div className="h-4 w-5/6 bg-outline-variant/30 rounded"></div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-tertiary/10 to-transparent my-2"></div>

          {/* The Guidance Skeleton */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-outline-variant/30 rounded-full"></div>
              <div className="h-6 w-32 bg-outline-variant/30 rounded"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-3 w-full bg-outline-variant/30 rounded"></div>
              <div className="h-3 w-11/12 bg-outline-variant/30 rounded"></div>
              <div className="h-3 w-4/5 bg-outline-variant/30 rounded"></div>
            </div>
          </div>

          {/* Reflection Skeleton */}
          <div className="bg-secondary/5 border border-secondary/10 rounded-lg p-4 mt-2">
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 bg-outline-variant/30 rounded-full mt-0.5"></div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-2.5 w-20 bg-outline-variant/30 rounded"></div>
                <div className="h-3 w-full bg-outline-variant/30 rounded"></div>
                <div className="h-3 w-2/3 bg-outline-variant/30 rounded"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
