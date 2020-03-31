import { POLYGON_GET_MODE, POLYGON_SET_ONE } from "../types";

const initialState = {
  polygon: [],
  polygons: []
};

let temp = {}

const polygon = (state = initialState, action) => {
  switch (action.type) {
    case POLYGON_SET_ONE:
      return {
        ...state,
        polygon: action.payload.polygons
      };
    case POLYGON_GET_MODE:
      return {
        ...state,
        polygons: action.payload
      };
    default:
      return state;
  }
};

export default polygon;

