export default function CategoryProductPage({ params }: { params: { category: string, product: string } }) { return <div>Product: {params.product} in {params.category}</div>; }
