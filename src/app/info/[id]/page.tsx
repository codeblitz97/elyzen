import { getInfo } from '@/lib/info';
import { ViewTransition } from 'react';

export default async function Info( { params }: {
    params: Promise<{
        id: string
    }>}
) {
    const {id} = await params
    const animeInfo = await getInfo(Number(id));

    return (
        <div>
            <ViewTransition name={`anime-info-${id}`}>
                <div>{animeInfo.title.english}</div>
            </ViewTransition>
        </div>
    )
}