export default function Button ({type="submit", className, content="button"}) {
    return (
        <button type={type} className={`btn btn-primary `+className}>{content}</button>
    )
}