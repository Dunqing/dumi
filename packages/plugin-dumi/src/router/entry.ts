export const generateEntry = (app: string) => {
  return `
    import ReactDOM from 'react-dom'

    ${app}
    
    ReactDOM.render(
      <App />,
      document.getElementById('docs')
    )
  `
}
