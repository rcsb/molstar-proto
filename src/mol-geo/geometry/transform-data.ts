/**
 * Copyright (c) 2018 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { ValueCell } from 'mol-util';
import { Mat4 } from 'mol-math/linear-algebra';
import { fillSerial } from 'mol-util/array';

export type TransformData = {
    aTransform: ValueCell<Float32Array>,
    uInstanceCount: ValueCell<number>,
    instanceCount: ValueCell<number>,
    aInstance: ValueCell<Float32Array>,
}

export function createTransform(transformArray: Float32Array, instanceCount: number, transformData?: TransformData): TransformData {
    if (transformData) {
        ValueCell.update(transformData.aTransform, transformArray)
        ValueCell.update(transformData.uInstanceCount, instanceCount)
        ValueCell.update(transformData.instanceCount, instanceCount)
        const aInstance = transformData.aInstance.ref.value.length >= instanceCount ? transformData.aInstance.ref.value : new Float32Array(instanceCount)
        ValueCell.update(transformData.aInstance, fillSerial(aInstance, instanceCount))
        return transformData
    } else {
        return {
            aTransform: ValueCell.create(transformArray),
            uInstanceCount: ValueCell.create(instanceCount),
            instanceCount: ValueCell.create(instanceCount),
            aInstance: ValueCell.create(fillSerial(new Float32Array(instanceCount)))
        }
    }
}

const identityTransform = new Float32Array(16)
Mat4.toArray(Mat4.identity(), identityTransform, 0)
export function createIdentityTransform(transformData?: TransformData): TransformData {
    return createTransform(identityTransform, 1, transformData)
}