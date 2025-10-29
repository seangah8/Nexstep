

export function NextepBackground(){

    const countArr = Array(50).fill(0)

    return(
        <section className="nextep-background">
            {
                countArr.map(() => 
                    <img src="src/assets/nextep_icon.png" alt="nextep-logo"/>
                )
            }
        </section>
    )
}