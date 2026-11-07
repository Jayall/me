const pattern = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1];

const PixelMosaic = () => (
	<div className="pixel-mosaic" aria-hidden="true">
		{pattern.map((cell, index) => (
			<span
				key={index}
				className={cell ? "on" : index % 3 === 0 ? "mid" : ""}
			/>
		))}
	</div>
);

export default PixelMosaic;
