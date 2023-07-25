interface Location {
	id: number;
	key: string;
	value: string;
	is_popular: boolean;
	region_display_name: string;
	seo_value: string;
}

export interface Country {
	id: number;
	country_id: number;
	key: string;
	value: string;
	display_name: string;
	sort_order: number;
	seo_value: string;
	locations: Location[];
}
