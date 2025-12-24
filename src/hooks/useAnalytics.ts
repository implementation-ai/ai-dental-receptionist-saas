import { useEffect } from 'react';
import { analytics } from '@/lib/firebase-client';
import { logEvent, setUserProperties, setUserId, Analytics } from 'firebase/analytics';

export const useAnalytics = () => {
    useEffect(() => {
        // Analytics is initialized when the component mounts if on client side
        if (analytics) {
            console.log('Analytics initialized');
        }
    }, []);

    const trackPageView = (pageName: string, additionalParams?: Record<string, any>) => {
        if (analytics) {
            logEvent(analytics, 'page_view', {
                page_title: pageName,
                page_location: window.location.href,
                page_path: window.location.pathname,
                ...additionalParams
            });
        }
    };

    const trackEvent = (eventName: string, params?: Record<string, any>) => {
        if (analytics) {
            logEvent(analytics, eventName, params);
        }
    };

    const trackUserLogin = (userId: string, method: string) => {
        if (analytics) {
            setUserId(analytics, userId);
            logEvent(analytics, 'login', { method });
        }
    };

    const trackUserSignup = (userId: string, method: string) => {
        if (analytics) {
            setUserId(analytics, userId);
            logEvent(analytics, 'sign_up', { method });
        }
    };

    const setUserProperty = (property: string, value: string) => {
        if (analytics) {
            setUserProperties(analytics, { [property]: value });
        }
    };

    return {
        trackPageView,
        trackEvent,
        trackUserLogin,
        trackUserSignup,
        setUserProperty
    };
};
