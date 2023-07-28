import React, { useState, useLayoutEffect, useRef } from 'react';
import style from '../../[lang]/company/[keyword]/components/InfoList/index.module.scss';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import classNames from 'classnames';
import { isURL } from '../../[lang]/company/[keyword]/components/InfoList';


export function isContentOverflowing(element) {
	return element?.scrollWidth > element?.clientWidth;
}
export function MouseOverPopover(props: {
	value: string;
	className?: string;
}) {
	const ref = useRef(null);
	const [showPop, setShow] = useState(false);

	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const is_url = isURL(props.value);
	const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
		if (!showPop)
			return;
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);


	useLayoutEffect(() => {
		if (isContentOverflowing(ref.current)) {
			setShow(true);
		}
	});
	return (
		<>
			<div
				className={classNames(style.overview_item_value, {
					[props.className]: !!props.className
				})}
				aria-owns={open ? 'mouse-over-popover' : undefined}
				aria-haspopup="true"
				onMouseEnter={handlePopoverOpen}
				onMouseLeave={handlePopoverClose}
				ref={ref}
			>
				{is_url ?
					<Link href={props.value} target={"_blank"} title={props.value}>{props.value}</Link> :
					<span>{props.value}</span>}
			</div>
			<Popover
				id="mouse-over-popover"
				sx={{
					pointerEvents: 'none',
				}}
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				onClose={handlePopoverClose}
				disableRestoreFocus
			>
				<Typography sx={{ p: 1 }} maxWidth={300} style={{ wordBreak: 'break-all', fontSize: 14 }}>{props.value}</Typography>
			</Popover>
		</>
	);
}
