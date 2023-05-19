import React from 'react'
import styles from './index.module.scss'

const Empty = ({ description,lang }: any) => {
    console.log(lang,'lang')
    return <div className={styles.container}>
        <svg width="287" height="285" viewBox="0 0 287 285" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M138.125 284.429C59.3313 282.29 29.2341 242.24 24.0347 222.482L38.7416 165.883L60.3563 94.3539C54.1913 84.2522 41.2373 62.177 38.7416 54.6898C35.622 45.3309 38.9644 32.6294 44.5352 26.1673C50.106 19.7052 67.4869 4.107 111.83 0.764524C156.174 -2.57795 171.549 5.88967 182.468 9.90065C193.387 13.9116 219.235 29.9555 226.812 45.7765C234.388 61.5976 229.04 79.647 224.806 86.7776C220.572 93.9082 215.447 100.37 215.002 116.86C214.556 133.349 242.41 142.263 249.763 144.937C257.117 147.611 264.693 151.844 274.052 164.1C295.221 197.525 283.857 228.276 274.052 238.972C264.248 249.668 236.616 287.104 138.125 284.429Z" fill="url(#paint0_linear_3914_23310)" />
            <path d="M236.839 102.153C240.583 86.2874 247.869 81.4296 251.435 80.3155C258.863 77.994 267.701 83.7694 271.49 92.3484C273.237 96.3063 276.838 101.707 275.501 112.96C273.707 128.059 256.337 130.118 251.435 129.004C246.47 127.876 232.16 121.985 236.839 102.153Z" fill="url(#paint1_linear_3914_23310)" />
            <path d="M74.3953 59.3687C58.7079 59.9035 46.467 71.773 42.3074 77.6409C33.6311 92.1157 32.4318 98.6506 34.5084 108.503L35.8453 126.775L36.848 151.844C40.5248 156.635 47.9005 166.35 47.9896 166.885C48.0788 167.42 60.0597 169.039 66.039 169.782L74.9523 157.526C77.812 154.258 84.4004 146.63 87.8765 142.262C103.973 133.603 105.469 116.76 105.921 111.678L105.926 111.623C106.372 106.609 104.032 100.593 96.7898 99.2557C89.5478 97.9187 90.3277 97.9187 84.8683 96.5817C76.6681 93.1947 81.4516 82.5433 84.8683 77.6409C87.9137 71.3274 90.0826 58.8339 74.3953 59.3687Z" fill="#00AFD4" />
            <path d="M10.9037 105.086C21.2431 99.7385 31.9985 107.315 36.0838 111.771L47.5596 122.579C55.4587 133.832 54.7726 134.709 52.3505 147.425C50.2113 158.655 54.2817 168.594 56.5843 172.159L53.6875 179.067C47.3739 176.244 34.0783 169.797 31.4043 166.588C28.0618 162.577 29.176 155.669 28.9532 150.767C28.7303 145.865 24.0508 142.968 18.4801 138.957C12.9093 134.946 10.1639 135.478 5.55576 128.261C4.37468 126.411 -2.02053 111.771 10.9037 105.086Z" fill="#00D3D2" />
            <path d="M65.3704 156.412C62.3398 158.284 62.3993 165.066 62.8078 168.223C68.1187 170.265 80.0773 172.768 85.4253 166.44C92.1102 158.53 95.1185 149.839 96.5669 146.719C98.0153 143.6 96.0098 136.246 90.6618 134.352C85.3139 132.458 81.4143 137.026 79.4088 142.263C77.4033 147.499 76.4006 150.285 74.6179 152.736C72.8353 155.187 69.1585 154.073 65.3704 156.412Z" fill="#00D5D1" />
            <mask id="mask0_3914_23310"
                style={{ maskType: 'alpha' }}
                maskUnits="userSpaceOnUse" x="24" y="0" width="263" height="285">
                <path d="M138.124 284.429C59.3308 282.29 29.2336 242.24 24.0342 222.482L38.7411 165.882L60.3558 94.3534C54.1908 84.2517 41.2368 62.1765 38.7411 54.6893C35.6215 45.3304 38.9639 32.629 44.5347 26.1668C50.1055 19.7047 67.4864 4.10651 111.83 0.764036C156.174 -2.57844 171.549 5.88919 182.468 9.90016C193.386 13.9111 219.235 29.955 226.811 45.7761C234.388 61.5971 229.04 79.6465 224.806 86.7771C220.572 93.9077 215.447 100.37 215.001 116.859C214.556 133.349 242.409 142.262 249.763 144.936C257.116 147.61 264.693 151.844 274.052 164.1C295.221 197.525 283.856 228.275 274.052 238.971C264.247 249.667 236.616 287.103 138.124 284.429Z" fill="url(#paint2_linear_3914_23310)" />
                <path d="M236.839 102.153C240.582 86.2869 247.869 81.4291 251.434 80.315C258.863 77.9935 267.701 83.7689 271.489 92.3479C273.237 96.3058 276.837 101.707 275.5 112.96C273.706 128.058 256.336 130.118 251.434 129.004C246.47 127.875 232.159 121.985 236.839 102.153Z" fill="url(#paint3_linear_3914_23310)" />
            </mask>
            <g mask="url(#mask0_3914_23310)">
                <path d="M121.022 217.843C148.118 235.05 231.547 242.708 269.874 244.386L249.374 305.25L221.742 327.673C164.846 333.47 49.627 344.789 43.9225 343.69C38.218 342.592 17.1826 264.826 7.37793 226.081C33.9692 216.166 93.9258 200.637 121.022 217.843Z" fill="url(#paint4_linear_3914_23310)" />
            </g>
            <path d="M107.51 159.867L28.6191 170.371L29.6911 183.877L62.0619 190.951H104.294L107.51 159.867Z" fill="#BDCAEA" />
            <path d="M164.32 137.572C156.688 139.201 150.349 143.038 148.134 144.753V159.009L149.956 167.585L153.815 182.162L161.64 192.023L191.331 195.346L223.595 193.631L224.238 186.557C218.2 186.164 204.129 184.97 196.155 183.341C188.18 181.712 183.256 175.659 181.791 172.837L173.323 160.296L178.79 156.223C181.577 154.436 188.223 149.32 192.51 143.146C196.798 136.972 195.94 126.853 194.975 122.566L191.438 98.877L185.65 100.592C185.471 101.914 185.028 106.252 184.685 113.026C184.257 121.494 183.614 124.495 181.791 128.997C179.969 133.499 173.859 135.535 164.32 137.572Z" fill="#414141" />
            <path d="M23.6887 209.816C23.3457 203.299 26.9758 181.519 28.8338 171.443C49.9869 180.112 62.9486 183.285 89.5022 183.662V251.62C68.4934 251.834 32.4782 236.399 28.8338 233.398C25.1894 230.396 24.1175 217.963 23.6887 209.816Z" fill="#97A8DB" />
            <path d="M104.294 190.952L107.514 159.804C115.16 160.733 134.007 162.74 147.384 163.941C160.761 165.141 166.106 174.445 167.107 178.947L104.294 190.952Z" fill="#97A8DB" />
            <path d="M89.5024 252.015V182.985H175.682C169.641 202.959 167.498 213.621 166.892 231.22C150.222 242.837 130.107 246.573 89.5024 252.015Z" fill="#BDCAEA" />
            <path d="M134.307 152.042C122.559 163.275 119.551 175.516 119.515 180.232C133.128 180.625 160.611 180.168 161.64 175.194C162.926 168.977 165.499 168.549 166.464 168.013C167.428 167.477 168.822 164.047 168.393 158.687C167.964 153.328 164.641 147.861 162.498 146.897C160.354 145.932 148.992 138 134.307 152.042Z" fill="#2378E5" />
            <path d="M111.154 208.316C102.065 201.199 93.0037 188.629 89.6094 183.234C126.798 179.68 146.431 177.531 167.214 171.872C175.662 181.829 180.837 187.036 190.795 195.775C182.613 198.848 164.791 205.25 158.96 206.279C151.671 207.566 123.052 213.568 120.855 213.675C118.657 213.783 114.477 210.674 111.154 208.316Z" fill="#D5DFF5" />
            <path d="M65.6485 168.334L56.2896 177.693L57.2366 183.821L69.3809 187.497L119.908 179.921V176.077L116.677 165.715L98.1262 175.743L77.8485 168.334L74.6175 178.751L73.2805 176.968L65.6485 168.334Z" fill="#ECEEF9" />
            <path d="M76.6788 173.793L68.9912 180.701L84.3108 182.985L76.6788 173.793Z" fill="white" />
            <path d="M100.574 166.134L91.7168 173.209L98.1233 177.61L105.978 173.209L100.574 166.134Z" fill="white" />
            <path d="M0.964844 189.772C6.96741 186.599 21.7593 175.516 28.405 170.371C43.1233 175.358 79.1205 182.83 89.2878 182.805C85.429 191.895 74.603 203.742 69.6724 208.53C63.384 207.601 48.7493 205.25 40.5172 203.278C30.2272 200.813 10.8261 193.953 0.964844 189.772Z" fill="#ADBAE8" />
            <path d="M211 247.454C191.391 246.919 179.284 239.432 175.682 235.755L211 239.209L229.496 241.772C226.079 243.666 217.596 247.454 211 247.454Z" fill="#BDCAEA" />
            <path d="M106.111 262.703C93.8111 258.425 89.7704 243.762 89.2876 236.966L106.891 250.113L144.216 254.792C135.897 256.761 116.629 261.099 106.111 262.703Z" fill="#97A8DB" />
            <path d="M131.774 107.39L110.939 128.559L128.209 146.385L149.044 125.55L131.774 107.39Z" fill="white" />
            <path d="M107.04 259.361C93.8479 253.3 90.03 241.905 89.77 236.966C99.586 239.714 105.508 240.675 116.956 241.311C121.492 249.297 127.417 252.316 145.255 254.57C137.753 255.647 119.607 258.113 107.04 259.361Z" fill="white" />
            <path d="M201.298 228.053C196.128 230.549 181.614 234.069 175.003 235.518C192.496 248.887 220.684 246.102 232.048 228.053C214.445 237.746 205.42 230.17 201.298 228.053Z" fill="white" />
            <path d="M231.045 187.721H224.583L222.466 189.28V193.403C224.1 193.254 227.658 192.935 228.817 192.846C229.976 192.757 230.785 194.22 231.045 194.963L232.605 199.642C232.828 197.637 233.341 192.979 233.608 190.395C233.875 187.81 232.011 187.535 231.045 187.721Z" fill="#2378E5" />
            <path d="M185.978 96.1363L186.479 100.649L190.658 99.813C190.528 98.8845 190.256 96.8493 190.212 96.1363C190.167 95.4233 190.49 95.2821 190.658 95.3006L193.889 92.9609C192.125 92.8681 188.262 92.7381 186.925 92.9609C185.588 93.1838 185.737 95.1707 185.978 96.1363Z" fill="#2378E5" />
            <path d="M167.761 165.548C162.413 165.727 150.9 172.827 145.812 176.356L162.191 173.57C162.005 173.199 162.124 172.033 164.085 170.339C166.536 168.222 167.761 168.111 167.761 165.548Z" fill="#1C5BAE" />
            <path d="M93.8389 183.724L100.524 182.61C102.084 181.867 106.674 180.136 112.557 179.156C119.91 177.93 132.5 189.74 136.288 190.855C139.319 191.746 138.74 196.128 138.071 198.208C133.912 198.951 123.721 200.637 116.234 201.439C112.49 192.437 99.7439 185.878 93.8389 183.724Z" fill="url(#paint5_linear_3914_23310)" />
            <path d="M115.34 191.119C110.527 185.325 101.302 181.351 97.2905 180.089C101.153 179.272 111.062 177.437 119.797 176.635C124.253 177.638 137.623 188.556 142.525 193.236C139.406 197.068 126.073 198.249 119.797 198.361C120.317 198.361 120.153 196.912 115.34 191.119Z" fill="white" />
            <defs>
                <linearGradient id="paint0_linear_3914_23310" x1="-59.7278" y1="128.784" x2="316.931" y2="81.5982" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F9FAFE" />
                    <stop offset="1" stopColor="#DBDFEE" />
                </linearGradient>
                <linearGradient id="paint1_linear_3914_23310" x1="-59.7278" y1="128.784" x2="316.931" y2="81.5982" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F9FAFE" />
                    <stop offset="1" stopColor="#DBDFEE" />
                </linearGradient>
                <linearGradient id="paint2_linear_3914_23310" x1="-59.7283" y1="128.784" x2="316.931" y2="81.5977" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F9FAFE" />
                    <stop offset="1" stopColor="#DBDFEE" />
                </linearGradient>
                <linearGradient id="paint3_linear_3914_23310" x1="-59.7283" y1="128.784" x2="316.931" y2="81.5977" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F9FAFE" />
                    <stop offset="1" stopColor="#DBDFEE" />
                </linearGradient>
                <linearGradient id="paint4_linear_3914_23310" x1="-76.5429" y1="270.605" x2="251.686" y2="181.185" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#D9DCED" />
                    <stop offset="1" stopColor="#D6DAEC" />
                </linearGradient>
                <linearGradient id="paint5_linear_3914_23310" x1="106.204" y1="190.253" x2="120.688" y2="184.984" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#97A8DB" />
                    <stop offset="1" stopColor="#97A8DB" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>

        <div className={styles.description}>
            {description ? description : <>
                                    <div>{lang?.noResultsFound}</div>
                                    <div>{lang?.pleaseUseDifferentKeyword}</div>
                                </>}
        </div>
    </div>
}

export default Empty