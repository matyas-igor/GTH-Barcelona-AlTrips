import styled from 'styled-components'
import { shadow } from './Tooltip'

const Card = styled.div`
  border-radius: 4px;
  background-color: #fff;
  box-shadow: ${shadow};
  padding: 12px 24px;
  ${({ withOverflowHidden }) => withOverflowHidden && `overflow: hidden;`}
`

export const CardInner = styled.div`
  padding: 12px 24px;
`

export default Card;
