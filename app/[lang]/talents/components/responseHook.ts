import { useEffect } from 'react';

const useResponsiveFont = (designWidth, maxWidth) => {
	useEffect(() => {
		let tid;

		const refreshRem = () => {
			const doc = document;
			const win = window;
			const docEl = doc.documentElement;
			const remStyle = document.createElement("style");

			const width = docEl.getBoundingClientRect().width;
			maxWidth = maxWidth || 540;
			let rem = (width * 100) / designWidth;
			if (width >= maxWidth) {
				rem = 12;
			}
			remStyle.innerHTML = 'html{font-size:' + rem + 'px !important;}';

			if (docEl.firstElementChild) {
				docEl.firstElementChild.appendChild(remStyle);
			} else {
				let wrap = doc.createElement("div");
				wrap.appendChild(remStyle);
				doc.write(wrap.innerHTML);
				wrap = null;
			}
			return () => {
				if (remStyle && remStyle.parentNode) {
					remStyle.parentNode.removeChild(remStyle);
				}
			};
		};

		const handleResize = () => {
			clearTimeout(tid);
			tid = setTimeout(refreshRem, 300);
		};

		const handlePageShow = (e) => {
			if (e.persisted) {
				clearTimeout(tid);
				tid = setTimeout(refreshRem, 300);
			}
		};

		if (document.readyState === "complete") {
			document.body.style.fontSize = "16px";
		} else {
			document.addEventListener("DOMContentLoaded", function (e) {
				document.body.style.fontSize = "16px";
			}, false);
		}

		const cleanup = refreshRem();

		window.addEventListener("resize", handleResize, false);
		window.addEventListener("pageshow", handlePageShow, false);

		return () => {
			cleanup();
			window.removeEventListener("resize", handleResize, false);
			window.removeEventListener("pageshow", handlePageShow, false);
		};
	}, [designWidth, maxWidth]);
};

export default useResponsiveFont;