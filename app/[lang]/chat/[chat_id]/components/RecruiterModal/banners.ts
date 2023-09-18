import { recruiterBanner1, recruiterBanner2, recruiterBanner3, recruiterBanner4, recruiterBanner5 } from "images";
import { shuffle } from 'lodash-es'

const AllBanner = [recruiterBanner1, recruiterBanner2, recruiterBanner3, recruiterBanner4, recruiterBanner5]

export const getRandomBanner = () => {
  return shuffle(AllBanner)[0]
}