import React, { useState, useRef, useEffect } from 'react';
import './AutoScrollList.css'; // Assuming you have a CSS file named AutoScrollList.css in the same directory

const AutoScrollList = ({ items }: {items: any[]}) => {
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);
	const scrollRef = useRef(null);

	useEffect(() => {
		const scrollElement = scrollRef.current;
		const scrollContent = scrollElement.firstChild;

		const scrollAnimation = scrollElement.animate(
			[
				{ transform: 'translateX(0)' },
				{ transform: `translateX(-${scrollContent.offsetWidth / 2}px)` }
			],
			{
				duration: 5000, // adjust duration to control scroll speed
				iterations: Infinity
			}
		);

		scrollAnimation.onfinish = () => {
			scrollElement.scrollLeft = 0;
		};

		return () => {
			scrollAnimation.cancel();
		};
	}, [items]);

	const handleMouseDown = (e) => {
		setIsDragging(true);
		setStartX(e.pageX - scrollRef.current.offsetLeft);
		setScrollLeft(scrollRef.current.scrollLeft);
	};

	const handleMouseLeave = () => {
		setIsDragging(false);
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	const handleMouseMove = (e) => {
		if (!isDragging) return;
		e.preventDefault();
		const x = e.pageX - scrollRef.current.offsetLeft;
		const walk = (x - startX) * 3; // scroll-fast
		scrollRef.current.scrollLeft = scrollLeft - walk;
	};

	return (
		<div
			className="scroll-container"
			ref={scrollRef}
			onMouseDown={handleMouseDown}
			onMouseLeave={handleMouseLeave}
			onMouseUp={handleMouseUp}
			onMouseMove={handleMouseMove}
		>
			<div className="scroll-content">
				{items.map((item, index) => (
					<div key={index} className="scroll-item">
						{item}
					</div>
				))}
				{items.map((item, index) => (
					<div key={index + items.length} className="scroll-item">
						{item}
					</div>
				))}
			</div>
		</div>
	);
};

export default AutoScrollList;
