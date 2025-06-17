"use client";

import { useEffect, useState, useCallback } from "react";

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});

  const updateMetric = useCallback((name: string, value: number) => {
    setMetrics((prev) => ({ ...prev, [name]: value }));
  }, []);

  useEffect(() => {
    // Only run in production or when explicitly enabled
    if (
      process.env.NODE_ENV !== "production" &&
      !process.env.NEXT_PUBLIC_MONITOR_PERFORMANCE
    ) {
      return;
    }

    // Measure Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case "paint":
            if (entry.name === "first-contentful-paint") {
              updateMetric("fcp", entry.startTime);
            }
            break;
          case "largest-contentful-paint":
            updateMetric("lcp", entry.startTime);
            break;
          case "first-input":
            const firstInputEntry = entry as unknown as PerformanceEventTiming; // PerformanceEventTiming not available in all browsers
            updateMetric(
              "fid",
              firstInputEntry.processingStart - firstInputEntry.startTime
            );
            break;
          case "layout-shift":
            const layoutShiftEntry = entry as PerformanceEntry & {
              hadRecentInput?: boolean;
              value?: number;
            };
            if (!layoutShiftEntry.hadRecentInput) {
              updateMetric(
                "cls",
                (metrics.cls || 0) + (layoutShiftEntry.value || 0)
              );
            }
            break;
          case "navigation":
            const navEntry = entry as PerformanceNavigationTiming;
            updateMetric(
              "ttfb",
              navEntry.responseStart - navEntry.requestStart
            );
            break;
        }
      }
    });

    // Start observing
    try {
      observer.observe({
        entryTypes: [
          "paint",
          "largest-contentful-paint",
          "first-input",
          "layout-shift",
          "navigation",
        ],
      });
    } catch (e) {
      // Some browsers might not support all entry types
      console.warn("Performance observer not fully supported:", e);
    }

    return () => observer.disconnect();
  }, [updateMetric, metrics.cls]);

  return metrics;
}
