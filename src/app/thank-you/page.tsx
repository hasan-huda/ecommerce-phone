import { Suspense } from "react"
import ThankYou from "./ThankYou"

const Page = () => {
  //suspense has a display fallback until the children finish loading
  return <Suspense>
    <ThankYou/>
  </Suspense>
}

export default Page