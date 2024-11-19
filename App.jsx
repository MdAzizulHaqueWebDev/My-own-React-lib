import React from "./React";
import { render } from "./ReactDOM";
import "./App.css";
const root = document.querySelector("#root");

function Card({ title, image, brand, price }) {
	return (
		<div className="card">
			<img src={image} alt="iphone" />
			<div className="card-content">
				<h3 style={{ fontFamily: "sans-serif" }}>{title}</h3>
				<p>{brand}</p>
				<p>
					<b>${price}</b>
				</p>
			</div>
		</div>
	);
}

fetch("https://dummyjson.com/products")
	.then((res) => res.json())
	.then((data) => {
		// console.log(data);
		render(
			<div className="container">
				{data.products.map((product) => {
					return (
						<Card
							title={product.title}
							brand={product.brand}
							price={product.price}
							image={product.thumbnail}
						/>
					);
				})}
			</div>,
			root,
		);
	});
