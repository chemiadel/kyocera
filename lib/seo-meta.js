import Head from 'next/head'
const Meta = (props) => (      
<Head>
<title>{props.title}</title>
<meta>{props.title}</meta>
<meta name="description">{props.title}</meta>
</Head>
)
export default Meta