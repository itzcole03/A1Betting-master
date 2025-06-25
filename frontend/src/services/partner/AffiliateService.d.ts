export interface AffiliateLink {
    id: string;
    partnerName: string;
    url: string;
    campaignCode?: string;
    active: boolean;
    offerId?: string;
}
export interface AffiliateOffer {
    id: string;
    partnerName: string;
    description: string;
    url: string;
    validFrom: string;
    validTo: string;
    isActive: boolean;
}
export declare class AffiliateService {
    /**
     * Fetch all affiliate links for a user from backend/partner API
     */
    getAffiliateLinks: (userId: string) => Promise<AffiliateLink[]>;
    /**
     * Track a click on an affiliate link
     */
    trackAffiliateClick: (linkId: string, userId: string) => Promise<void>;
    /**
     * Fetch all active affiliate offers
     */
    getAffiliateOffers: () => Promise<AffiliateOffer[]>;
}
export declare const affiliateService: AffiliateService;
