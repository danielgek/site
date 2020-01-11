// import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
// import { ReactComponent as Spinner } from "../assets/images/loading-spinner.svg"
import React from "react"
import {
  animated,
  useSpring,
  useTransition,
  useChain,
  config,
} from "react-spring"
import useMeasure from "react-use-measure"

// let isEmailValid = function(email) {
//   // eslint-disable-next-line
//   let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//   return re.test(email)
// }

export function usePrevious(value) {
  const ref = React.useRef()
  React.useEffect(() => void (ref.current = value), [value])
  return ref.current
}

const SPRING_CONFIG = { tension: 275, clamp: true }

export default function() {
  let [open, set] = React.useState(false)

  let state = open ? "open" : "closed"

  const openSpringRef = React.useRef()
  const openSpringTransitions = useTransition(state, null, {
    config: SPRING_CONFIG,
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    unique: true,
    ref: openSpringRef,
  })

  const closedSpringRef = React.useRef()
  const closedSpringTransitions = useTransition(state, null, {
    config: SPRING_CONFIG,
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    unique: true,
    ref: closedSpringRef,
  })

  useChain(
    open ? [closedSpringRef, openSpringRef] : [openSpringRef, closedSpringRef]
  )

  const [openRef, openBounds] = useMeasure()
  const [closedRef, closedBounds] = useMeasure()
  let finalHeight = open ? openBounds.height : closedBounds.height
  let containerSpring = useSpring({
    to: { height: finalHeight },
    config: SPRING_CONFIG,
  })

  return (
    <div className="flex">
      <div className="relative w-1/2">
        <animated.div style={containerSpring} className="overflow-hidden">
          {closedSpringTransitions.map(
            ({ item, key, props }) =>
              item === "closed" && (
                <animated.div className="absolute" key={key} style={props}>
                  <div ref={closedRef}>Click to expand...</div>
                </animated.div>
              )
          )}
          {openSpringTransitions.map(
            ({ item, key, props }) =>
              item === "open" && (
                <animated.div className="absolute" key={key} style={props}>
                  <div ref={openRef}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Illum quaerat cumque odio natus beatae rem sunt explicabo.
                    Esse aliquam alias sint eius aliquid quisquam dolorum
                    consequuntur unde id blanditiis? Ducimus.
                  </div>
                </animated.div>
              )
          )}
        </animated.div>
      </div>
      <div className="w-1/2">
        <button onClick={() => set(!open)}>{open ? "Close" : "Open"}</button>
      </div>
    </div>
  )
}

// export function SignupForm() {
//   // configure
//   let fadeOutInDelay = 0.4
//   let feedbackDelay = 900

//   // state
//   let convertKitUrl = "https://app.convertkit.com/forms/987317/subscriptions"
//   let [email, setEmail] = useState("")
//   let [error, _setError] = useState("")
//   let [formState, setFormState] = useState("")
//   let [isShowingThankYou, setIsShowingThankYou] = useState(false)
//   let [thankYouHeight, setThankYouHeight] = useState(0)

//   let setError = function(type) {
//     _setError(type)
//     setFormState("error")
//   }

//   let resetForm = function() {
//     _setError("")
//     setFormState("")
//   }

//   let isSaving = formState === "saving"
//   let isError = formState === "error"
//   let didSignup = formState === "finished"

//   function handleChange(event) {
//     event.preventDefault()

//     setEmail(event.target.value)

//     if (isError && error === "invalidEmail" && isEmailValid(email)) {
//       // user corrected the invalid email, so lets reset the form state
//       resetForm()
//     }

//     if (isError && error === "noEmail" && email) {
//       // user started typing after submitting an empty form, lets reset the form state
//       resetForm()
//     }
//   }

//   let handleSubmit = async function(event) {
//     event.preventDefault()

//     if (!email) {
//       setError("noEmail")
//     } else if (!isEmailValid(email)) {
//       setError("invalidEmail")
//     } else {
//       setFormState("saving")

//       let formData = new FormData(event.target)

//       try {
//         let postData = fetch(convertKitUrl, {
//           method: "POST",
//           body: formData,
//         })

//         let waitForFeedback = new Promise(resolve => {
//           setTimeout(resolve, feedbackDelay)
//         })

//         let [response] = await Promise.all([postData, waitForFeedback])

//         if (response.ok) {
//           setFormState("finished")
//         } else {
//           setError("serverError")
//         }
//       } catch (e) {
//         console.error(e)
//         setError("serverError")
//       }
//     }
//   }

//   let handleTransitionEnd = function(e) {
//     // not really sure how to best do this
//     if (!isShowingThankYou && e.target.tagName === "FORM") {
//       setIsShowingThankYou(true)
//       setThankYouHeight(e.target.offsetHeight)
//     }
//   }

//   let isAnimatingFormOut = didSignup && !isShowingThankYou

//   return (
//     <div className="relative">
//       {didSignup && (
//         <div
//           className={`text-gray-500 ${isAnimatingFormOut ? "absolute" : ""} ${
//             isShowingThankYou ? "opacity-100" : "opacity-0"
//           }`}
//           style={{
//             height: `${thankYouHeight}px`,
//             transition: `opacity ${fadeOutInDelay}s`,
//           }}
//         >
//           <p>
//             Thanks <span className="text-white">{email}</span>! Check your email
//             soon to confirm your address.
//           </p>
//         </div>
//       )}

//       {(!didSignup || isAnimatingFormOut) && (
//         <form
//           onSubmit={handleSubmit}
//           className={didSignup ? "opacity-0" : "opacity-100"}
//           style={{
//             transition: `opacity ${fadeOutInDelay}s`,
//           }}
//           onTransitionEnd={e => handleTransitionEnd(e)}
//         >
//           <div className="flex shadow-black">
//             <input
//               type="email"
//               required
//               name="email_address"
//               value={email}
//               disabled={isSaving}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-white border-2 border-r-0 border-transparent rounded rounded-r-none form-input focus:shadow-none focus:border-green-700"
//             />
//             <Button isRunning={didSignup || isSaving}>Subscribe</Button>
//           </div>
//           {isError && (
//             <div className="mt-5">
//               {error === "serverError" &&
//                 "Woops — something's wrong with our signup form 😔. Please try again."}
//               {error === "invalidEmail" &&
//                 "Oops — that's an invalid email address!"}
//               {error === "noEmail" && "Please fill out your email address!"}
//             </div>
//           )}
//         </form>
//       )}
//     </div>
//   )
// }

// function useWindowWidth() {
//   let isBrowser = typeof window !== "undefined"
//   const [width, setWidth] = useState(isBrowser ? window.innerWidth : 0)

//   useEffect(() => {
//     const handleResize = () => setWidth(window.innerWidth)

//     if (isBrowser) {
//       window.addEventListener("resize", handleResize)
//     }

//     return () => {
//       isBrowser && window.removeEventListener("resize", handleResize)
//     }
//   }, [isBrowser])

//   return width
// }

// function Button({ isRunning = false, children }) {
//   // configure
//   let buttonExpandDuration = 0.25
//   let spinnerOpacityDuration = 0.25

//   // state
//   let spinnerEl = useRef(null)
//   let windowWidth = useWindowWidth()

//   let [shouldUseTransitions, setShouldUseTransitions] = useState(false)
//   let [spinnerWidth, setSpinnerWidth] = useState(0)
//   let [spinnerTop, setSpinnerTop] = useState(0)
//   let [isNudged, setIsNudged] = useState(isRunning)
//   let [isShowingSpinner, setIsShowingSpinner] = useState(isRunning)
//   let isWideButton = false

//   let nudgeAmount = isWideButton ? 0 : spinnerWidth * 0.75
//   let spinnerOffset = isWideButton ? spinnerWidth * 0.75 : nudgeAmount + 1

//   // this grabs the size of the spinner
//   // we need to render at least once before we know what spinnerWidth
//   // actually is. so we'll useLayoutEffect to  make the re-render sync
//   // before the browser paints the button
//   useLayoutEffect(() => {
//     let verticalSpacing =
//       spinnerEl.current.parentElement.offsetHeight -
//       spinnerEl.current.offsetHeight
//     setSpinnerWidth(spinnerEl.current.offsetWidth)
//     setSpinnerTop(verticalSpacing / 2)
//   }, [windowWidth])

//   useEffect(() => {
//     // we'll start animating things here as state changes.
//     // if we dont know the spinnerWidth we're going to exit,
//     // because without that we can really animate.
//     if (!spinnerWidth) {
//       return
//     }

//     // if we have the spinnerWidth we know we've done at least
//     // one render. that means that we can start animating, so we'll
//     // enable transitions
//     setShouldUseTransitions(true)
//   }, [spinnerWidth])

//   // For smaller buttons we'll stagger the animation so the next
//   // nudges and then the spinner comes in
//   useEffect(() => {
//     if (!isWideButton) {
//       if (isRunning) {
//         isNudged ? setIsShowingSpinner(true) : setIsNudged(true)
//       } else {
//         isShowingSpinner ? setIsShowingSpinner(false) : setIsNudged(false)
//       }
//     }
//   }, [isRunning, isWideButton, isNudged, isShowingSpinner])

//   // for large buttons we don't need to nudge, so we wont stagger
//   // the animation
//   useEffect(() => {
//     if (isWideButton) {
//       setIsShowingSpinner(isRunning)
//       setIsNudged(isRunning)
//     }
//   }, [isRunning, isWideButton])

//   let handleTransitionEnd = function(e) {
//     e.preventDefault()
//     e.stopPropagation()
//     setIsNudged(isRunning)
//     setIsShowingSpinner(isRunning)
//   }

//   return (
//     <button
//       disabled={isRunning}
//       onTransitionEnd={e => handleTransitionEnd(e)}
//       className={`px-6 py-2 md:px-8 text-white ${
//         isNudged ? "bg-green-900 opacity-50" : "bg-green-700"
//       } ${isRunning && "cursor-not-allowed"}
//       relative rounded bg-green-700 hover:bg-green-900 focus:outline-none focus:outline-shadow rounded-l-none`}
//       style={{
//         transition: shouldUseTransitions
//           ? `background-color ${buttonExpandDuration}s, color ${buttonExpandDuration}s`
//           : "",
//       }}
//     >
//       <div
//         onTransitionEnd={e => handleTransitionEnd(e)}
//         style={{
//           transform: isNudged
//             ? `translateX(${-nudgeAmount}px)`
//             : `translateX(0)`,
//           transition: shouldUseTransitions
//             ? `transform ${buttonExpandDuration}s`
//             : "",
//         }}
//       >
//         {children}
//       </div>
//       <span
//         ref={spinnerEl}
//         onTransitionEnd={e => handleTransitionEnd(e)}
//         className={`absolute ${isShowingSpinner ? "opacity-100" : "opacity-0"}`}
//         style={{
//           transition: shouldUseTransitions
//             ? `opacity ${spinnerOpacityDuration}s`
//             : "",
//           right: `${spinnerOffset}px`,
//           top: `${spinnerTop}px`,
//         }}
//       >
//         <Spinner className="w-4 h-4 loading" />
//       </span>
//     </button>
//   )
// }
