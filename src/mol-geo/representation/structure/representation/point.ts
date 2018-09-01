/**
 * Copyright (c) 2018 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { UnitsRepresentation } from '..';
import { ElementPointVisual, DefaultElementPointProps } from '../visual/element-point';
import { StructureRepresentation } from '../units-representation';

export const DefaultSpacefillProps = {
    ...DefaultElementPointProps
}
export type PointProps = typeof DefaultElementPointProps

export type PointRepresentation = StructureRepresentation<PointProps>

export function PointRepresentation(): PointRepresentation {
    return UnitsRepresentation(ElementPointVisual)
}