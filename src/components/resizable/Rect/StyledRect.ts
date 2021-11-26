import styled from 'styled-components/macro';

export default styled.div`
  position: absolute;
  border: 2px solid ${(props) => props.color};
  touch-action: none;
  .square {
    position: absolute;
    width: 10px;
    height: 10px;
    background: white;
    border: 2px solid ${(props) => props.color};
  }
  .resizable-handler {
    position: absolute;
    width: 14px;
    height: 14px;
    cursor: pointer;
    z-index: 1;
    &.tl,
    &.t,
    &.tr {
      top: -7px;
    }
    &.tl,
    &.l,
    &.bl {
      left: -7px;
    }
    &.bl,
    &.b,
    &.br {
      bottom: -7px;
    }
    &.br,
    &.r,
    &.tr {
      right: -7px;
    }
    &.l,
    &.r {
      margin-top: -7px;
    }
    &.t,
    &.b {
      margin-left: -7px;
    }
  }
  .controls_plate {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 5px;
    position: absolute;
    width: 140px;
    height: 30px;
    top: -40px;
    display: flex;
    justify-content: center;
    left: calc(50% - 70px);
  }
  .control__box {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .rotate {
  }
  .compass {
    opacity: 0.3;
    &:hover {
      opacity: 1;
    }
  }
  .liftUP {
    opacity: 0.3;
    &:hover {
      opacity: 1;
    }
  }
  .moveDOWN {
    opacity: 0.3;
    &:hover {
      opacity: 1;
    }
  }
  .t,
  .tl,
  .tr {
    top: -6px;
  }
  .b,
  .bl,
  .br {
    bottom: -6px;
  }
  .r,
  .tr,
  .br {
    right: -6px;
  }
  .tl,
  .l,
  .bl {
    left: -6px;
  }
  .l,
  .r {
    top: 50%;
    margin-top: -9px;
  }
  .t,
  .b {
    left: 50%;
    margin-left: -3px;
  }
`;
