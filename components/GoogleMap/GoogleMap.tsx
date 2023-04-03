'use client'
import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

import './GoogleMap.css'

const loader = new Loader({
  apiKey: 'AIzaSyCe1D2ED6vz7EB4BXIkppNU3ISoaWAErd4',
  version: 'weekly',
  libraries: ['places']
})

interface Props {
  handleCancel?: Function
  handleOk?: Function
  isModalOpen?: boolean
  defaultAddress?: string
  lat?: number
  lng?: number
  width?: string
  height?: string
  id?: string

  gestureHandling: 'auto' | 'none'
  zoomControl: boolean
  fullscreenControl: boolean
  streetViewControl: boolean
  clickable?: boolean
  infoWindow?: string
  zoom?: number
}

/**
 *
 * @description 描述
 * @param {string} id 自定义渲染容器
 * @param {number} [width = '100%'] 如果传了自定义ID可省略
 * @param {string} gestureHandling 用户手势无法平移或缩放地图
 * @param {boolean} zoomControl 缩放控件的启用/停用状态
 * @param {boolean} fullscreenControl 全屏控件的启用/停用状态
 * @param {boolean} streetViewControl 是否显示小黄人
 * @param {boolean} clickable 是否可以点击
 * @param {string} infoWindow 标点上面显示的信息,传值就等于open
 *
 * @returns
 */
const GoogleMap = ({
  width,
  height,
  defaultAddress,
  lat,
  lng,
  id,

  gestureHandling,
  zoomControl,
  fullscreenControl,
  streetViewControl,
  clickable = true,
  infoWindow,
  zoom = 16
}: Props) => {
  let maerker
  const search = useRef<any>()
  const searchCart = useRef<HTMLElement>()
  const mapInput = useRef<HTMLInputElement>()

  // eslint-disable-next-line
  const [address, setAddress] = useState<object | null>(null)

  useEffect(() => {
    loader.load().then(() => {
      // @ts-ignore
      let mapWrapperNode: HTMLElement
      if (id) {
        mapWrapperNode = document.getElementById(id)
      } else {
        mapWrapperNode = document.getElementById('map')
      }

      // @ts-ignore
      const map = new google.maps.Map(mapWrapperNode, {
        center: { lat: lat ? Number(lat) : 14.59889, lng: lng ? Number(lng) : 120.98417 },
        zoom,
        // disableDefaultUI: true,
        // fullscreenControl: true,
        zoomControl: zoomControl,
        gestureHandling: gestureHandling,
        fullscreenControl,
        streetViewControl,
        controlSize: 25
      })

      map.setClickableIcons(clickable)

      // initMaerker
      if (lat && lng) {
        placeMarkerAndPanTo({ lat, lng }, map)
      }

      // TODO
      // initInput(map)
      // initSearchCart(map)

      // const input = inputDom as HTMLInputElement

      // const options = {
      //   fields: ['address_components', 'geometry', 'icon', 'name'],
      //   strictBounds: false,
      //   types: ['establishment']
      // }
      // const autocomplete = new google.maps.places.Autocomplete(input, options)

      // autocomplete.addListener('place_changed', () => {
      //   const placeResult = autocomplete.getPlace()
      //   setAddress(placeResult)
      //   map.setCenter(placeResult.geometry?.location)
      //   placeMarkerAndPanTo(placeResult.geometry?.location, map)
      // })

      // @ts-ignore
      search.current = new google.maps.places.PlacesService(map)

      // map.addListener('click', (ev) => {
      //   placeMarkerAndPanTo(ev.latLng, map)
      //   // if (ev.placeId) {
      //   //   searchPlaceDetail(ev.placeId, map)
      //   // } else {
      //   //   searchPlaceList(ev.latLng, map)
      //   // }
      // })
    })
  }, [])

  // @ts-ignore
  const placeMarkerAndPanTo = (latLng: google.maps.LatLng, map: google.maps.Map) => {
    if (maerker) {
      maerker.setMap(null)
    }

    // @ts-ignore
    maerker = new google.maps.Marker({
      position: latLng,
      map: map
    })

    if (infoWindow) {
      // @ts-ignore
      const infowindow = new google.maps.InfoWindow({
        content: infoWindow,
        position: maerker
      })

      infowindow.open({
        anchor: maerker,
        map
      })
    }
  }

  const searchPlace = (ev: any, map: any) => {
    if (ev.target?.value) {
      // var request = {
      //   query: ev.target?.value,
      //   fields: ['ALL']
      // }
      // search.current.findPlaceFromQuery(request, function (results, status) {
      //   if (status === google.maps.places.PlacesServiceStatus.OK) {
      //     renderSearchPlaceList(results, map)
      //   }
      // })
      const request = {
        query: ev.target?.value
      }
      search.current.textSearch(request, function (results, status) {
        // @ts-ignore
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          renderSearchPlaceList(results, map)
        }
      })
    }
  }

  const searchPlaceDetail = (placeId, map) => {
    const request = {
      placeId: placeId,
      fields: ['ALL']
    }
    // @ts-ignore
    const service = new google.maps.places.PlacesService(map)
    service.getDetails(request, callback)

    function callback(place, status) {
      // @ts-ignore
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        ;(mapInput.current as HTMLInputElement).value = place.name + place.formatted_address
        setAddress(place)
        map.setCenter(place.geometry?.location)
      }
    }
  }

  // eslint-disable-next-line
  const searchPlaceList = (latLng, map) => {
    // @ts-ignore
    const pyrmont = new google.maps.LatLng(latLng.lat(), latLng.lng())
    const request = {
      location: pyrmont,
      // @ts-ignore
      rankBy: google.maps.places.RankBy.DISTANCE,
      type: ['All']
    }

    // @ts-ignore
    const service = new google.maps.places.PlacesService(map)
    service.nearbySearch(request, callback)

    function callback(results, status) {
      // @ts-ignore
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        ;(mapInput.current as HTMLInputElement).value = ''
        renderSearchPlaceList(results, map)
      }
    }
  }

  // eslint-disable-next-line
  const initInput = (map) => {
    mapInput.current = document.createElement('input')
    mapInput.current.type = 'text'
    mapInput.current.placeholder = 'Search map'
    mapInput.current.value = defaultAddress ? defaultAddress : ''
    mapInput.current.id = 'pac-input'
    mapInput.current.style.marginTop = '29px'
    mapInput.current.style.marginLeft = '37px'
    mapInput.current.style.paddingLeft = '15px'
    mapInput.current.style.width = '312px'
    mapInput.current.style.height = '38px'
    mapInput.current.style.fontSize = '14px'
    mapInput.current.addEventListener('focus', () => {
      ;(searchCart.current as HTMLElement).innerHTML = ''
      ;(mapInput.current as HTMLInputElement).placeholder = 'Search map'
    })
    mapInput.current.addEventListener('input', (ev) => searchPlace(ev, map))
    // @ts-ignore
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(mapInput.current)
  }

  // eslint-disable-next-line
  const initSearchCart = (map) => {
    searchCart.current = document.createElement('div')
    searchCart.current.id = 'place-list-wrapper'
    searchCart.current.style.backgroundColor = '#fff'
    searchCart.current.style.marginTop = '2px'
    searchCart.current.style.marginLeft = '37px'
    searchCart.current.style.width = '312px'
    searchCart.current.style.borderRadius = '10px'
    searchCart.current.style.paddingLeft = '24px'
    searchCart.current.style.paddingRight = '24px'
    searchCart.current.style.maxHeight = '159px'
    searchCart.current.style.overflowY = 'auto'
    // @ts-ignore
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(searchCart.current)
  }

  const renderSearchPlaceList = (placeList: [any], map) => {
    ;(mapInput.current as HTMLInputElement).placeholder = 'Please select your location in the list'
    ;(searchCart.current as HTMLElement).innerHTML = ''

    const fragment = document.createDocumentFragment()
    for (let i = 0; i < placeList.length && i < placeList.length; i++) {
      const li = document.createElement('li')
      const span = document.createElement('span')

      li.innerText = placeList[i].name
      li.style.width = '100%'
      li.style.height = '38px'
      li.style.lineHeight = '38px'
      li.style.fontSize = '14px'
      li.style.whiteSpace = 'nowrap'
      li.style.textOverflow = 'ellipsis'
      li.style.overflow = 'hidden'
      li.style.cursor = 'pointer'
      li.addEventListener('click', () => handelSelectPlacel(placeList[i], map))

      if (placeList[i].vicinity || placeList[i].formatted_address) {
        span.innerText = placeList[i].vicinity || placeList[i].formatted_address
        span.style.color = '#707070'
        span.style.paddingLeft = '4px'

        li.appendChild(span)
      }
      fragment.appendChild(li)
    }

    searchCart.current?.appendChild(fragment)
  }

  const handelSelectPlacel = (placel, map) => {
    placeMarkerAndPanTo(placel.geometry?.location, map)

    if (placel.place_id) {
      searchPlaceDetail(placel.place_id, map)
    } else {
      ;(mapInput.current as HTMLInputElement).value = placel.name + placel.formatted_address
      setAddress(placel)
    }
  }

  return (
    <div className='mapWrapper'>
      <div
        id='map'
        style={{ width: width ? width : '100%', height: height ? height : '230px' }}
      ></div>
    </div>
  )
}

export default GoogleMap
