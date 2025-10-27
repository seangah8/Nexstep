

export function NextepBackground(){

    const countArr = Array(100).fill(0)

    return(
        <section className="nextep-background">
            {
                countArr.map(index => 
                    <img src="src/assets/nextep_icon.png" alt="nextep-logo"/>
                )
            }
        </section>
    )
}