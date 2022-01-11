/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import {ButtonHTMLAttributes, FC} from 'react'

const Button : FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({children, ...props}) => {
    
    return <button css={[style]} {...props}> <span css={spanBorder}> {children}</span> </button>

}

const style = css`
cursor:pointer;
--color: #000000;
--background-color: #83b440;
--border-color: darken(#83b440, 7.5%);
padding: 0.2em 0.5em;
border-radius: 0.5em;
color: var(--color);
font-family: inherit;
background-color: var(--background-color);
border: solid 0.1em var(--border-color);
outline: none;
position: relative;
user-select: none;
box-shadow:
  0 0.2em 0.4em rgba(0, 0, 0, 0.4),
  0 -0.3em 0.6em rgba(0, 0, 0, 0.2) inset;
transition: box-shadow 65ms ease-out;
&:after {
  content: "";
  background-color: #ffffff;
  width: 75%;
  height: 12.5%;
  position: absolute;
  top: 0.15em;
  left: 12.5%;
  border-radius: 50%;
  filter: blur(0.15em);
  transition: opacity 65ms ease-out;
}
&:active {
  box-shadow:
    0 0 0 rgba(0, 0, 0, 0.4),
    0 0.4em 1em rgba(0, 0, 0, 0.3) inset;
  &:after {
    opacity: 0;
  }
}

`

const spanBorder = css`
    color:white;
    margin: 0 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

export default Button