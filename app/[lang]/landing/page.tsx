'use client'
import Section1 from './components/Section1'
import Section2 from './components/Section2-Swiper'
import Section3 from './components/Section3'
import Section4 from './components/Section4'
import Title from "./components/Title";
export default function Page({
    params,
    searchParams,
  }: {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
  }) {
    return <>
        <Section1></Section1>
        <Section2></Section2>
        <Section3></Section3>
        <Section4></Section4>
    </>;
  }