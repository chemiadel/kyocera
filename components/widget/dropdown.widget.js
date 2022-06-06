import {useState} from "react";
const { parseCookies, setCookie, destroyCookie } = require('nookies');

const DropdownWidget = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    let dropdownItems = []
    for (let i = 0; i < props.subitems.length; i++) {
        dropdownItems.push(<a className="dropdown-item" key={i.toString()} onClick={() => props.callback(props.subitems[i].value)}>{props.subitems[i].label}</a>)
    }

    const {tenant} = parseCookies()
    const tenantJSON=JSON.parse(tenant || '{}')
    return (
        <div className="dropdown show">
            <button
                className="btn btn-secondary dropdown-toggle btn-block"
                type="button"
                onClick={toggleDropdown}
                >
                {tenantJSON?.country_name || "DOMAIN"}
            </button>

            {
                isOpen &&
                <div className="dropdown-menu show" aria-labelledby="dropdownMenuButton">
                    { dropdownItems }
                </div>
            }

        </div>
    )
}

export default DropdownWidget;
