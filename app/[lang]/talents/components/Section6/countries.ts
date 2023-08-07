interface ICountry {
  country: string;
  flag: string;
  image: string;
  coming?: boolean;
}

const countries: ICountry[] = [
	{
		"country": "Philippines",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Philippines-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Philippines.png`
	},
	{
		"country": "Singapore",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Singapore-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Singapore.png`
	},
	{
		"country": "Indonesia",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Indonesia-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Indonesia.png`
	},

	{
		"country": "Hongkong",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Hongkong-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Hongkong.png`,
	},
	{
		"country": "Macao",
		"flag": `${process.env.S3_BUCKET_URL}/landing/macao-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Macao.png`
	},
	{
		"country": "Taiwan",
		"flag": `${process.env.S3_BUCKET_URL}/landing/taiwan-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/taiwan.png`
	},
	{
		"country": "Japan",
		"flag": `${process.env.S3_BUCKET_URL}/landing/japen-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/japen.png`
	},
	{
		"country": "Malaysia",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Malaysia-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Malaysia.png`,
		"coming": true,
	},

	{
		"country": "Thailand",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Thailand-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Thailand.png`,
		"coming": true,
	},
	{
		"country": "Vietnam",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Vietnam-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Vietnam.png`,
		"coming": true,
	},
	{
		"country": "Australia",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Australia-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Australia.png`,
		"coming": true,
	},
	{
		"country": "Nigeria",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Nigeria-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Nigeria.png`,
		"coming": true,
	},
	{
		"country": "South Korea",
		"flag": `${process.env.S3_BUCKET_URL}/landing/SouthKorea-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/SouthKorea.png`,
		"coming": true,
	},
	{
		"country": "India",
		"flag": `${process.env.S3_BUCKET_URL}/landing/India-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/India.png`,
		"coming": true,
	},
	{
		"country": "Türkiye",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Türkiye-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Türkiye.png`,
		"coming": true,
	},
	{
		"country": "Chile",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Chile-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Chile.png`,
		"coming": true,
	},
	{
		"country": "Bangladesh",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Bangladesh-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Bangladesh.png`,
		"coming": true,
	},
	{
		"country": "Europe",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Europe-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Europe.png`,
		"coming": true,
	},
	{
		"country": "Brazil",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Brazil-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Brazil.png`,
		"coming": true,
	},
	{
		"country": "USA",
		"flag": `${process.env.S3_BUCKET_URL}/landing/USA-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/USA.png`,
		"coming": true,
	},
	{
		"country": "Mexico",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Mexico-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Mexico.png`,
		"coming": true,
	},
	{
		"country": "Canada",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Canada-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Canada.png`,
		"coming": true,
	},
	{
		"country": "Pakistan",
		"flag": `${process.env.S3_BUCKET_URL}/landing/Pakistan-flag.png`,
		"image": `${process.env.S3_BUCKET_URL}/landing/Pakistan.png`,
		"coming": true,
	},
];

export default countries