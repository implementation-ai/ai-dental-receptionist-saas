"use client"

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '@/hooks/useAnalytics';

export function AnalyticsTracker() {
    const pathname = usePathname();
    const { trackPageView } = useAnalytics();

    useEffect(() => {
        if (pathname) {
            trackPageView(pathname);
        }
    }, [pathname, trackPageView]);

    return null;
}
