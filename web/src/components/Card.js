import styled from 'styled-components'
import { shadow } from './Tooltip'

const Card = styled.div`
  border-radius: 4px;
  background-color: #fff;
  box-shadow: ${shadow};
  padding: 12px 16px;
  ${({ withOverflowHidden }) => withOverflowHidden && `overflow: hidden;`}
`

export default Card;
