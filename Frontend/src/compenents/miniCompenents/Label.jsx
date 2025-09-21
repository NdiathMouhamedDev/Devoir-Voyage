export default function Label ({className, content="Label"}) {
    return (
        <div>
            <label className={`bg-base-300 `+ className} >{content}</label>
        </div>
    )
} 